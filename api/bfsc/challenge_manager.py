import os
import time
import typing

from core import logging
from core.exceptions import NotFoundException
from core.exceptions import UnauthorizedException
from core.requester import Requester
from core.util import date_util
from core.util import json_util
from core.util.typing_util import JsonObject
from core.web3.eth_client import RestEthClient
from eth_account.messages import encode_defunct
from web3 import Web3
from web3._utils import method_formatters
from web3._utils.rpc_abi import RPC
from web3.types import BlockData

from bfsc.model import LeaderboardEntry

# Connect to Base Sepolia RPC
w3 = Web3()
requester = Requester()
ethClient = RestEthClient(url='https://sepolia.base.org', requester=requester)
readEthClient = RestEthClient(url='https://sepolia-preconf.base.org', requester=requester)
privateKey = os.environ['PRIVATE_KEY']
account = w3.eth.account.from_key(privateKey)


async def get_pending_block(ethClient: RestEthClient, shouldHydrateTransactions: bool = False) -> BlockData:
    response = await ethClient._make_request(method='eth_getBlockByNumber', params=['pending', shouldHydrateTransactions])  # noqa: SLF001
    if response['result'] is None:
        raise NotFoundException
    return typing.cast(BlockData, method_formatters.PYTHONIC_RESULT_FORMATTERS[RPC.eth_getBlockByNumber](response['result']))


class ChallengeManager:
    async def submit(self, message: str, signature: str) -> LeaderboardEntry:
        submitDate = date_util.datetime_from_now()
        try:
            messageJson = typing.cast(JsonObject, json_util.loads(message))
            messageHash = encode_defunct(text=messageJson['message'])  # type: ignore[arg-type]
            signerAddress = w3.eth.account.recover_message(messageHash, signature=signature)
        except Exception as error:  # noqa: BLE001
            logging.error(f'Error submitting message: {error!s}')
            raise UnauthorizedException('Invalid signature')
        if messageJson['message'] != 'Base FlashBlocks are so damn fast!':
            raise UnauthorizedException('Invalid message')
        try:
            requestTimeString = messageJson['requestTime']
            requestDate = date_util.datetime_from_string(requestTimeString.rstrip('Z'))  # type: ignore[union-attr]
        except Exception as error:  # noqa: BLE001
            logging.error(f'Error submitting message: {error!s}')
            raise UnauthorizedException('Invalid request time')
        if requestDate > submitDate:
            raise UnauthorizedException('Request time too far in the future')
        try:
            params = {
                'from': account.address,
                'to': '0x0000000000000000000000000000000000000000',
            }
            response = await ethClient._make_request(method='eth_estimateGas', params=[params])  # noqa: SLF001
            gas = int(response['result'], 16)
            params['gas'] = hex(gas)
            response = await ethClient._make_request(method='eth_maxPriorityFeePerGas')  # noqa: SLF001
            maxPriorityFeePerGas = int(response['result'], 16)
            params['maxPriorityFeePerGas'] = hex(maxPriorityFeePerGas)
            response = await ethClient._make_request(method='eth_getBlockByNumber', params=['pending', False])  # noqa: SLF001
            baseFeePerGas = int(response['result']['baseFeePerGas'], 16)
            maxFeePerGas = baseFeePerGas + maxPriorityFeePerGas
            params['maxFeePerGas'] = hex(maxFeePerGas)
            transactionCount = await ethClient.get_transaction_count(account.address)
            params['nonce'] = hex(transactionCount)
            params['value'] = hex(0)
            params['chainId'] = hex(84532)
            signedParams = w3.eth.account.sign_transaction(transaction_dict=params, private_key=privateKey)
            transactionHash = await ethClient.send_raw_transaction(transactionData=signedParams.raw_transaction.hex())
            startTime = time.time()
            flashBlockSeconds: float = -1.0
            while time.time() - startTime < 10:  # noqa: PLR2004
                pendingBlock = await get_pending_block(ethClient=readEthClient, shouldHydrateTransactions=False)
                flashBlockSeconds = time.time() - startTime
                if any(transactionHash == f'0x{tx.hex()}' for tx in pendingBlock['transactions']):  # type: ignore[union-attr]
                    break
                flashBlockSeconds = -1.0
            transactionReceipt2 = await ethClient.wait_for_transaction_receipt(transactionHash=transactionHash, sleepSeconds=0.01)  # type: ignore[arg-type]
            blockSeconds = time.time() - startTime
        except Exception as error:  # noqa: BLE001
            logging.error(f'Error submitting transaction: {error!s}')
            raise UnauthorizedException('Failed to submit transaction')
        return LeaderboardEntry(
            address=signerAddress,
            requestDate=requestDate,
            submitDate=submitDate,
            flashBlockMillis=int(flashBlockSeconds * 1000),
            blockMillis=int(blockSeconds * 1000),
            transactionHash=transactionHash,
            blockNumber=transactionReceipt2['blockNumber'],
        )
