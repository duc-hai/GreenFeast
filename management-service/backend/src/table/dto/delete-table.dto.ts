import { IsNotEmpty } from "class-validator";

export class DeleteTablesDto {
    @IsNotEmpty()
    ids: number[];
}