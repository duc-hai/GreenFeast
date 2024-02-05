import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Menu } from './interfaces/menu.interface';

@Injectable() //Khai báo metadata (siêu dữ liệu), Khai báo rằng lớp này có thể được quản lý bởi container Nest IoC
export class MenuService {
    private readonly menus: Menu[] = [];

    create(menu: Menu) {
        this.menus.push(menu);
    }

    findAll(): Menu[] {
        return this.menus;
    }

    catchExpcetion() {
        try {

        }
        catch (error) {
            //Mặc định trả về json cho client
            throw new HttpException({
                status: 'error',
                message: 'message'
            }, HttpStatus.FORBIDDEN, {
                cause: error //đối số thứ 3 là tùy chọn, cause này sẽ không được gửi thành đối tượng res nhưng dùng để ghi nhật ký log, cung cấp thông tin về giá trị lỗi
            })
        }
    }
}
