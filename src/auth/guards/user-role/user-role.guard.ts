import { Reflector } from '@nestjs/core';

import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor (
    private readonly reflector: Reflector
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const validRoles: string [] = this.reflector.get('roles', context.getHandler());

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if ( !user )
      throw new BadRequestException('User not found')

    console.log( { userRoles: user.roles } );

    for (const role of user.roles) {
      if ( validRoles.includes(role) ){
        return true;
      }
    }

    throw new ForbiddenException(
      `User ${ user.fullName } needs a valid role: [${ validRoles }]`
    );
  }
}
