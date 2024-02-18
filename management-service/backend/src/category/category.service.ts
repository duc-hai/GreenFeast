import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
    ){}

    async findAllCategories(): Promise<any> {
        try {
            const categories = await this.categoryRepository.find({
                where: {
                    isDeleted: false,
                }
            })

            if (!categories)
                throw new HttpException({
                    status: 'error',
                    message: 'Không tìm thấy danh mục nào',
                }, HttpStatus.NOT_FOUND, {
                    cause: 'Không tìm thấy danh mục nào' 
                })
                
            return categories
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

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<any> {
        try {
            const categoryData = {
                ...createCategoryDto,
                ...{
                    created_at: new Date()
                }
            } //JS Spread

            const category = await this.categoryRepository.create(categoryData)

            await this.categoryRepository.save(category)

            return category
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

    async updateCategory (id: any, updateCategoryDto: CreateCategoryDto): Promise<any> {
        try {
            if (!this.isNumeric(id))
                throw new ForbiddenException('Mã khu vực không hợp lệ')

            //Convert to number
            id = parseInt(id.toString())

            const categoryDataUpdate = {
                ...updateCategoryDto,
                ... {
                    updated_at: new Date()
                }
            }

            const result = await this.categoryRepository.update({
                id: id,
                isDeleted: false,
            }, categoryDataUpdate)

            if (result.affected === 0)
                throw new HttpException({
                    status: 'error',
                    message: `Đã xảy ra lỗi`,
                }, HttpStatus.NOT_FOUND, {
                    cause: 'Đã xảy ra lỗi'
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

    isNumeric(n: any): boolean {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    
    async deleteCategory(id: any): Promise<any> {
        try {
            if (!this.isNumeric(id))
            throw new ForbiddenException('Mã khu vực không hợp lệ')

            //Convert to number
            id = parseInt(id.toString())

            //Soft delete
            const result = await this.categoryRepository.update({
                id: id,
                isDeleted: false,
            }, {
                isDeleted: true,
                deleted_at: new Date()
            })

            if (result.affected === 0) {
                throw new HttpException({
                    status: 'error',
                    message: `Không tìm thấy danh mục phù hợp`,
                }, HttpStatus.NOT_FOUND, {
                    cause: 'Không tìm thấy danh mục phù hợp'
                })
            }
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
