from pydantic import BaseModel

from bfsc.api.v1_resources import LeaderboardEntry


class SubmitMessageRequest(BaseModel):
    message: str
    signature: str


class SubmitMessageResponse(BaseModel):
    entry: LeaderboardEntry


class GetLeaderboardRequest(BaseModel):
    pass


class GetLeaderboardResponse(BaseModel):
    entries: list[LeaderboardEntry]