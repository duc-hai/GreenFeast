import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTableAutoDto {
    @IsNotEmpty()
    @IsString()
    shortname: string;

    @IsNotEmpty()
    quantity: number;

    @IsOptional()
    from: number;

    @IsNotEmpty()
    area_id: number;
}