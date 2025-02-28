import datetime

from pydantic import BaseModel


class LeaderboardEntry(BaseModel):
    address: str
    requestDate: datetime.datetime
    submitDate: datetime.datetime
    blockNumber: int
    transactionHash: str
    flashBlockMillis: int
    blockMillis: int
