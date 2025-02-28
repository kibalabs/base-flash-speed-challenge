from core.api.api_request import KibaApiRequest
from core.api.json_route import json_route
from starlette.routing import Route

from bfsc.api import v1_endpoints as endpoints
from bfsc.api import v1_resources as resources
from bfsc.api.v1_resources import LeaderboardEntry
from bfsc.api.v1_resources import LeaderboardOrderBy
from bfsc.challenge_manager import ChallengeManager


def create_v1_routes(challengeManager: ChallengeManager) -> list[Route]:
    @json_route(requestType=endpoints.SubmitMessageRequest, responseType=endpoints.SubmitMessageResponse)
    async def submit_message(request: KibaApiRequest[endpoints.SubmitMessageRequest]) -> endpoints.SubmitMessageResponse:
        entry = await challengeManager.submit(message=request.data.message, signature=request.data.signature)
        return endpoints.SubmitMessageResponse(entry=resources.LeaderboardEntry.model_validate(entry.model_dump()))

    @json_route(requestType=endpoints.GetLeaderboardRequest, responseType=endpoints.GetLeaderboardResponse)
    async def get_leaderboard(request: KibaApiRequest[endpoints.GetLeaderboardRequest]) -> endpoints.GetLeaderboardResponse:
        order_by = request.query_params.get('order_by', LeaderboardOrderBy.RATIO)
        entries = await challengeManager.get_leaderboard(order_by=order_by)
        return endpoints.GetLeaderboardResponse(entries=[LeaderboardEntry.model_validate(entry.model_dump()) for entry in entries])

    return [
        Route('/submit', methods=['POST'], endpoint=submit_message),
        Route('/leaderboard', methods=['GET'], endpoint=get_leaderboard),
    ]
