import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ){}


  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    }
    catch(error){
      this.handleDBExceptions(error);
    }
  }

  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto;
    return await this.productRepository.find({
      take: limit,
      skip: offset
    });

    // TODO:Relaciones
    
    
  }

  async findOne(term: string) {
      let product: Product;
      if (isUUID(term)){
        product = await this.productRepository.findOneBy({id: term});
      }else{
        // product = await this.productRepository.findOneBy({slug: term});
        const queryBuilder = this.productRepository.createQueryBuilder();
        product = await queryBuilder
          .where('LOWER(title) = :title or slug = :slug', {
            title: term.toLowerCase(),
            slug: term.toLowerCase(),
          })
          .getOne();
      }

      
      if ( !product )
        throw new NotFoundException(`Product with ${term} not found.`)
      return product;
    
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });
    if (!product)
      throw new NotFoundException(`Product with id ${id} not found.`)
    try{
      return await this.productRepository.save(product);
    }catch(error){
      this.handleDBExceptions(error);
    }
    
    
  }

  async remove(id: string) {
    const product = await this.findOne( id );
    await this.productRepository.remove( product );
  }

  private handleDBExceptions( error: any ){
    console.error(error)
    if ( error.code === '23505')
    throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, chech server logs.')

    


  }
}