import os

from core import logging
from core.api.default_routes import create_default_routes
from core.api.middleware.exception_handling_middleware import ExceptionHandlingMiddleware
from core.api.middleware.logging_middleware import LoggingMiddleware
from core.api.middleware.server_headers_middleware import ServerHeadersMiddleware
from core.util.value_holder import RequestIdHolder
from starlette.applications import Starlette
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware
from starlette.routing import Mount

from bfsc.api.v1_api import create_v1_routes
from bfsc.challenge_manager import ChallengeManager

name = os.environ.get('NAME', 'base-flash-speed-challenge-api')
version = os.environ.get('VERSION', 'local')
environment = os.environ.get('ENV', 'dev')
isRunningDebugMode = environment == 'dev'

requestIdHolder = RequestIdHolder()
if isRunningDebugMode:
    logging.init_basic_logging()
else:
    logging.init_json_logging(name=name, version=version, environment=environment, requestIdHolder=requestIdHolder)

challengeManager = ChallengeManager()


async def startup() -> None:
    pass


async def shutdown() -> None:
    pass


app = Starlette(
    routes=[
        *create_default_routes(name=name, version=version, environment=environment),
        Mount(
            path='/v1',
            routes=create_v1_routes(challengeManager=challengeManager),
        ),
    ],
    on_startup=[startup],
    on_shutdown=[shutdown],
)
app.add_middleware(ExceptionHandlingMiddleware)
app.add_middleware(ServerHeadersMiddleware, name=name, version=version, environment=environment)
app.add_middleware(LoggingMiddleware, requestIdHolder=requestIdHolder)
app.add_middleware(GZipMiddleware, minimum_size=1000, compresslevel=9)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
    expose_headers=['*'],
    allow_origins=[
        'http://localhost:3000',
    ],
    allow_origin_regex='https://.*\\.?(tokenpage.xyz)',
)
