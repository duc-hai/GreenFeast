import { IsNotEmpty, IsString } from "class-validator";

export class CreateTableDto {
    @IsNotEmpty({
        message: 'Tên bàn không được để trống'
    })
    @IsString({
        message: 'Tên bàn không hợp lệ'
    })
    name: string;

    @IsNotEmpty({
        message: 'Khu vực không được để trống'
    })
    area_id: number;
}