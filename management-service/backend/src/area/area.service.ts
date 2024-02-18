import { HttpException, HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from '../entities/area.entity';
import { Repository } from 'typeorm';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Injectable()
export class AreaService {
    constructor(
        @InjectRepository(Area)
        private areaRepository: Repository<Area>,
    ) {}

    async getAllAreas (): Promise<any> {
        try {
            //There is no need to use pagination technique here because the area's data is not much
            const areas = await this.areaRepository.find({
                where: {
                    isDeleted: false,
                },
                order: {
                    name: "ASC"
                }
            });

            if (!areas) 
                throw new HttpException({
                    status: 'error',
                    message: `Không tìm thấy khu vực phù hợp`,
                }, HttpStatus.NOT_FOUND, {
                    cause: 'Không tìm thấy khu vực phù hợp'
                })
    
            return areas;
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

    async createArea(createAreaDto: CreateAreaDto): Promise<any> {
        try {
            if (createAreaDto.price_percentage) {
                if (typeof createAreaDto.price_percentage === 'string')
                createAreaDto.price_percentage = parseInt(createAreaDto.price_percentage)

                if (createAreaDto.price_percentage > 100 || createAreaDto.price_percentage < -100)
                    //Only receive a maximum discount of 100% and a maximum price increase of 100% (x2)
                    throw new NotAcceptableException('Phần trăm giá phải nằm trong khoảng -100 đến 100')
            }

            //console.log(createAreaDto);
            const areaData = {...createAreaDto, ...{created_at: new Date()}} //JS Spread
            
            const area = await this.areaRepository.create(areaData)

            await this.areaRepository.save(area)
            //console.log(area)
            return area
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

    async updateArea (id: number, data: UpdateAreaDto): Promise<any> {
        try {
            id = parseInt(id.toString())
            // console.log(id, data)
            const updateData = {...data, ...{updated_at: new Date()}}
            const result = await this.areaRepository.update({ id: id, isDeleted: false}, updateData)
            
            if (result.affected === 0) //Affected is record be influenced, 0 means no record updated
                throw new HttpException({
                    status: 'error',
                    message: `Không tìm thấy khu vực phù hợp`,
                }, HttpStatus.NOT_FOUND, {
                    cause: 'Không tìm thấy khu vực phù hợp'
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

    async deleteArea (id): Promise<any> {
        try {
            id = parseInt(id.toString())
            
            // const result = await this.areaRepository.delete({id: id, isDeleted: false})

            //Soft delete:
            const result = await this.areaRepository.update({ id: id, isDeleted: false}, {isDeleted: true, deleted_at: new Date()})

            if(result.affected === 0)
                throw new HttpException({
                    status: 'error',
                    message: `Không tìm thấy khu vực phù hợp`,
                }, HttpStatus.NOT_FOUND, {
                    cause: 'Không tìm thấy khu vực phù hợp'
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
}
