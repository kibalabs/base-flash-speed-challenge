from eth_account import Account
import secrets

def create_wallet():
    private_key = secrets.token_hex(32)
    account = Account.from_key('0x' + private_key)
    print('New wallet created!')
    print('Address:', account.address)
    print('Private key:', private_key)
    print('\nIMPORTANT: Save your private key securely! If you lose it, you cannot recover your wallet.')

if __name__ == '__main__':
    create_wallet()
