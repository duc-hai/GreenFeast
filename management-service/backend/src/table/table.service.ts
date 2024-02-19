import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Table } from '../entities/table.entity';
import { Repository } from 'typeorm';
import { CreateTableDto } from './dto/create-table.dto';
import { Area } from 'src/entities/area.entity';
import { CreateTableAutoDto } from './dto/create-tables-auto.dto';
import { DeleteTablesDto } from './dto/delete-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TableService {
    constructor(
        @InjectRepository(Table)
        private tableRepository: Repository<Table>,

        @InjectRepository(Area)
        private areaRepository: Repository<Area>,
    ) {}

    async getTablesByArea(area_id: number): Promise<any> {
        try {
            const results = await this.tableRepository.find({
                where: {
                    area_id: area_id, 
                    isDeleted: false
                },
                order: {
                    name: "ASC"
                }
            })

            // || results.length == 0
            if (!results ) {
                throw new HttpException({
                    status: 'error',
                    message: `Không tìm thấy bàn phù hợp`,
                }, HttpStatus.NOT_FOUND, {
                    cause: 'Không tìm thấy bàn phù hợp'
                })
            }
            
            return results
        }
        catch (err) {
            throw new HttpException({
                status: 'error',
                message: `${err.message}`,
            }, HttpStatus.FORBIDDEN, {
                cause: err 
            })
        }
    } 

    async createTable(createTableDto: CreateTableDto): Promise<any> {
        try {
            if (typeof createTableDto.area_id === 'string')
                createTableDto.area_id = parseInt(createTableDto.area_id)
            //Check foreign key
            const checkForeignKey = await this.areaRepository.findOneBy({id: createTableDto.area_id, isDeleted: false})

            //console.log(checkForeignKey)

            if (!checkForeignKey)
                throw new HttpException({
                    status: 'error',
                    message: `Không tìm thấy id khu vực`,
                }, HttpStatus.NOT_FOUND, {
                    cause: 'Không tìm thấy id khu vực'
                })

            const tableData = {
                ...createTableDto,
                ...{created_at: new Date()}
            }

            const table = await this.tableRepository.create(tableData)

            await this.tableRepository.save(table)

            return table
        }
        catch (err) {
            throw new HttpException({
                status: 'error',
                message: `${err.message}`,
            }, HttpStatus.FORBIDDEN, {
                cause: err 
            })
        }
    }

    async createTablesAuto(createTableAutoDto: CreateTableAutoDto): Promise<any> {
        try {
            if (typeof createTableAutoDto.area_id === 'string')
                createTableAutoDto.area_id = parseInt(createTableAutoDto.area_id)
            
            //Check foreign key
            const checkForeignKey = await this.areaRepository.findOneBy({id: createTableAutoDto.area_id, isDeleted: false})

            //console.log(checkForeignKey)

            if (!checkForeignKey)
                throw new HttpException({
                    status: 'error',
                    message: `Không tìm thấy id khu vực`,
                }, HttpStatus.NOT_FOUND, {
                    cause: 'Không tìm thấy id khu vực'
                })
        
            let arrayInsert = []
            let from = parseInt(createTableAutoDto.from.toString()) || 1
            const length = parseInt(createTableAutoDto.quantity.toString())
            for (let i = 0; i < length; ++i) {
                arrayInsert.push({
                    created_at: new Date(),
                    name: createTableAutoDto.shortname + this.autoNumber(from + length - 1, from),
                    area_id: createTableAutoDto.area_id
                })
                from++
            }
            //console.log(arrayInsert)

            const result = await this.tableRepository.insert(arrayInsert)

            if (!(result.raw.affectedRows === length)) {
                throw new ConflictException('Đã xảy ra lỗi')
            }

            const tablesList = arrayInsert.map(value => value.name)

            return tablesList
        }
        catch (err) {
            throw new HttpException({
                status: 'error',
                message: `${err.message}`,
            }, HttpStatus.FORBIDDEN, {
                cause: err 
            })
        }
    }

    //Function add 0 automatic. Eg: create table from 1 to 10, then result will be: A01, A02, A03, ... A10
    autoNumber(maxNumber: number, number: number): string {
        let maxLength = maxNumber.toString().length

        //Add 0 to number
        let num = number.toString()
        while (num.length < maxLength) {
            num = '0' + num
        }
        return num    
    }

    async updateTable (id: number, data: UpdateTableDto) {
        try {
            id = parseInt(id.toString())
            
            const updateData = {
                ...data, 
                ...{updated_at: new Date()}
            } // JS Spread
            
            const result = await this.tableRepository.update({
                id: id,
                isDeleted: false
            }, updateData)

            if (result.affected === 0)
                throw new HttpException({
                    status: 'error',
                    message: `Không tìm thấy bàn phù hợp`,
                }, HttpStatus.NOT_FOUND, {
                    cause: 'Không tìm thấy bàn phù hợp'
                })
        }
        catch (err) {
            throw new HttpException({
                status: 'error',
                message: `${err.message}`,
            }, HttpStatus.FORBIDDEN, {
                cause: err 
            })
        }
    }

    async deleteTables (deleteTableDto: DeleteTablesDto): Promise<any | null>{
        try {
            const ids = [
                ...deleteTableDto.ids,
                ...[]
            ]

            //Soft delete
            // or not use soft delete here
            const updateDataArr = ids.map(value => {
                return {
                    id: value,
                    isDeleted: true //update to deleted
                }
            })

            //console.log(updateData)
            await this.tableRepository.save(updateDataArr) 
        }
        catch (err) {
            throw new HttpException({
                status: 'error',
                message: `${err.message}`,
            }, HttpStatus.FORBIDDEN, {
                cause: err 
            })
        }
    }
}
