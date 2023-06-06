
import { Controller, Post, Body, Get, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDTO, LoginUserDTO } from './dto';
import { Auth, GetUser, RawHeaders } from './decorators';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDTO: CreateUserDTO ) {
    return this.authService.create(createUserDTO);
  }

  @Post('login')
  loginUser(@Body() loginUserDTO:LoginUserDTO ) {
    return this.authService.login(loginUserDTO);
  }
  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ){

    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @GetUser('fullName') userFullName: string,
    @RawHeaders() rawHeaders: string [],
  ){
    return {
      ok:true,
      message: 'Hola Mundo private',
      user,
      userEmail,
      userFullName,
      rawHeaders,
    }
  }

  @Get('private2')
  // @SetMetadata('roles', ['admin', 'super-user'])
  @RoleProtected(ValidRoles.admin)
  @UseGuards( AuthGuard(), UserRoleGuard )
  testingPrivateRoute2(
    @GetUser() user: User,
    
  ){
    return {
      ok: true,
      user,
    }
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  testingPrivateRoute3(
    @GetUser() user: User,
    
  ){
    return {
      ok: true,
      user,
    }
  }
}
