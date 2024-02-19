import { IsBoolean, IsIP, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdatePrinterDto {
    @IsOptional()
    @IsString({
        message: 'Tên máy in phải là một chuỗi'
    })
    name: string;

    @IsOptional()
    @IsIP("4", {
        message: 'Địa chỉ IPv4 không hợp lệ'
    }) //IP v4
    ip_address: string;

    @IsOptional()
    @IsInt({
        message: 'Loại máy in không hợp lệ'
    })
    printer_type: number;

    @IsOptional()
    area_id: number;
}