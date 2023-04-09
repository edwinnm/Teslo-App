import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    
    @IsOptional()
    @IsPositive()
    @Type(() => Number) //Alternativa a tener que declarar en el main.ts enableImplicitConversions: true
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type(() => Number) //Alternativa a tener que declarar en el main.ts enableImplicitConversions: true
    offset?: number;
}