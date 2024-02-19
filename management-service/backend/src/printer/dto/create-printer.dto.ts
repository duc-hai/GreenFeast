import { IsBoolean, IsIP, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePrinterDto {
    @IsNotEmpty({
        message: 'Tên máy in không được để trống'
    })
    @IsString({
        message: 'Tên máy in phải là một chuỗi'
    })
    name: string;

    @IsNotEmpty({
        message: 'Địa chỉ IP không được để trống'
    })
    @IsIP("4", {
        message: 'Địa chỉ IP không hợp lệ'
    }) //IP v4
    ip_address: string;

    @IsNotEmpty({
        message: 'Loại máy in không được để trống'
    })
    @IsInt({
        message: 'Loại máy in không hợp lệ'
    })
    printer_type: number;

    @IsOptional()
    area_id: number;
}