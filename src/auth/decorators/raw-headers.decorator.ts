import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const RawHeaders = createParamDecorator( 
    (_, ctx: ExecutionContext) => {

        const req = ctx.switchToHttp().getRequest();

        return req.rawHeaders;

    }
);