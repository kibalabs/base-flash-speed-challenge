import datetime
from enum import Enum

from pydantic import BaseModel


class LeaderboardOrderBy(str, Enum):
    RATIO = 'ratio'
    REACTION_MILLIS = 'reaction_millis'
    FLASH_BLOCK_MILLIS = 'flash_block_millis'
    BLOCK_MILLIS = 'block_millis'
    SUBMIT_DATE = 'submit_date'


class LeaderboardEntry(BaseModel):
    address: str
    requestDate: datetime.datetime
    submitDate: datetime.datetime
    blockNumber: int
    transactionHash: str
    flashBlockMillis: int
    blockMillis: int
    reactionMillis: int
    position: int
    ratio: float
