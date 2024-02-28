import { IsNotEmpty } from "class-validator";

export class DeleteTablesDto {
    @IsNotEmpty({
        message: 'Mã bàn không được để trống'
    })
    ids: string[];
}