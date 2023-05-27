import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategies';


@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({defaultStrategy: "jwt" }),
    // En esta ocasion quiero registrar un modulo asyncrono porque deseo comporbar que exista una variable de entorno con el nombre JWT_SECRET
    // Registro Asincono
    JwtModule.registerAsync({
      //Si se desea usar Config Module para leer las variables de entorno, hay que importar el config module y el config service
      imports: [ConfigModule],
      inject: [ConfigService],

      // Es una funcion que se va a mandar a llamar cuando se intente registrar el modulo.
      useFactory: (configService: ConfigService) => {
        
        // Se puede utilizar directamente la variable con process.env.JWT_SECRET
        // console.log(`JWT secret process${process.env.JWT_SECRET}`)
        // O a traves de el config Module
        // console.log(`JWT secret configservice${configService.get('JWT_SECRET')}`)

        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        }
        
      }
    }),
    
    // Registro Sincrono
    // JwtModule.register({
    //     secret: process.env.JWT_SECRET,
    //     signOptions: {
    //       expiresIn: '2h'
    //     }
    //   }),

  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
