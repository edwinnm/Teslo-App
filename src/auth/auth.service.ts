import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { compareSync, hashSync } from "bcrypt";

import { CreateUserDTO, LoginUserDTO } from './dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
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
      //TODO: Retornar el JWT de acceso.

      return user;
    }
    catch (error){
      this.handleDBErrors(error);
    }
  }


  async login(loginUserDto: LoginUserDTO){
    
    const {password, email} = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true }
    });
    
    if(!user) 
      throw new UnauthorizedException(`Not valid credentials (email)`);

    if(!compareSync(password, user.password))
      throw new UnauthorizedException(`Not valid credentials (password)`);

    //TODO: Retornar el JWT de acceso.
    return user;

    

  }

  private handleDBErrors( error: any ): never{
      if( error.code === '23505')
        throw new BadRequestException(error.detail)
      
      console.log(error)
      throw new InternalServerErrorException(`Error: Please check server logs`)

      
  }

}
