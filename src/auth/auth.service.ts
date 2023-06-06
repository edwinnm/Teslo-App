import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { compareSync, hashSync } from "bcrypt";

import { CreateUserDTO, LoginUserDTO } from './dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ){}

  async create(createUserDTO: CreateUserDTO) {
    try{
      const {password, ...userData} = createUserDTO;

      const user = this.userRepository.create({
        ...userData,
        password: hashSync(password, 10)
      });
      await this.userRepository.save(user);
      delete user.password;
      
      return {...user,token: this.getJwtToken({id: user.id})};
    }
    catch (error){
      this.handleDBErrors(error);
    }
  }


  async login(loginUserDto: LoginUserDTO){
    
    const {password, email} = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id:true }
    });
    
    if(!user) 
      throw new UnauthorizedException(`Not valid credentials (email)`);

    if(!compareSync(password, user.password))
      throw new UnauthorizedException(`Not valid credentials (password)`);

    return {...user,token: this.getJwtToken({id: user.id})};

    

  }

  private handleDBErrors( error: any ): never{
      if( error.code === '23505')
        throw new BadRequestException(error.detail)
      
      console.log(error)
      throw new InternalServerErrorException(`Error: Please check server logs`)

  }

  async checkAuthStatus(user:User){
    return {...user,token: this.getJwtToken({id: user.id})};
  }

  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;

  }

}
