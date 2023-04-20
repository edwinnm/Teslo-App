import { Controller, Get, Post, UploadedFile, UseInterceptors, BadRequestException, Param, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';




@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
    ) {}

  @Post('product')
  @UseInterceptors( 
    FileInterceptor(
      'file',{
        fileFilter,
        // limits: { fileSize: 1000},
        storage: diskStorage({
          destination: './static/products',
          filename: fileNamer
        })

        }
      )
     )
  uploadProductImage( 
    @UploadedFile() file: Express.Multer.File
  ){
    
    if ( !file ) throw new BadRequestException("Make sure that the file is an image.")
    const secureUrl = `${ this.configService.get('HOST_API') }/files/products/${ file.filename }`;
    return { secureUrl };
  }

  @Get('product/:imageName')
  findProductImage(
    // Agrego el decorador Res para tener control de lo que se va a enviar.
    // PD: Cuidado al hacer esto, ya que quito la responsabilidad a Nest y puede saltarse interceptores globales.
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    const path = this.filesService.getStaticProductImage(imageName);
    // res.status(403).json({
    //   ok:false,
    //   path
    // })
    // Envio el file
    res.sendFile( path );
    
  }
}
