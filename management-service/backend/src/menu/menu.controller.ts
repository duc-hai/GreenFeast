import { Controller, Get, Res, Req, All, HttpCode, Header, Redirect, Param, Post, Body, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { CreateMenuDto } from 'src/menu/dto/create-menu.dto';
import { Menu } from 'src/menu/interfaces/menu.interface';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
    //Path: GET: /menu/all
    @Get('/all')
    findAll(): string {
        return 'All menu';
    }

    @Get()
    @HttpCode(204) //Mặc định là 200, có thể format //Để config động thì dùng @Res
    @Header('Cache-Control', 'none') //Hoặc dùng res.header
    @Redirect('https://nestjs.com', 301) //301 is status code (optional, 302 default: Found) hoặc res.redirect
    showRes(@Res({ passthrough: true }) res): void { //Passthrough = true nghĩa là cho phép các decorator tiêu chuẩn của nest hoạt động kết hợp với expressjs là res
        const array: number[] = [1, 2, 3, 4];
        res.status(200).send(JSON.stringify(array));
    }

    @Get()
    //async findOne(@Param('id', ParseIntPipe) id: number) { //bắt buộc id phải là number, nếu không sẽ quăng lỗi
    showReqObject(@Req() req: Request): string {
        //Req trong express
        console.log(req);
        return 'Show request object';
    }

    //Các decorator có sẵn trong nestjs
    // @Request(), @Req()
    // @Response(), @Res()*
    // @Next()
    // @Session()
    // @Param(key?: string)
    // @Body(key?: string)
    // @Query(key?: string)
    // @Headers(name?: string)
    // @Ip()
    // @HostParam()

    @Get(':id') //Path: menu/2
    //hoặc: findOne(@Param('id) id: any): string {
    findOne(@Param() params: any): string {
        console.log(params.id);
        return `This action returns a #${params.id} cat`;
    }
    
    //@Get(), @Post(), @Put(), @Delete(), @Patch(), @Options()và @Head()
    //All là điểm cuối xử lý chúng
    @All('/*') //* là design pattern, đại diện cho tất cả
    catchNotFound(): string {
        return 'Not found';
    }

    @Get()
    async findAllPromise():Promise<any[]>{
        return [];
    }

    @Post()
    async create(@Body() createMenuDto: CreateMenuDto){ 
    //Có thể validation pipe để lọc dữ liệu, dữ liệu nào không cần thiết sẽ tự động loại bỏ khỏi body
    //https://docs.nestjs.com/techniques/validation#stripping-properties
        return 'This action add new menu';
    }

    // @Get()
    // findAllFullSource(@Query() query: ) {
    //   return `This action returns all cats (limit: ${query.limit} items)`;
    // }
    @Get(':id')
    findOneOne(@Param('id') id: string) {
      return `This action returns a #${id} cat`;
    }
  
    @Put(':id')
    update(@Param('id') id: string, @Body() updateCatDto: CreateMenuDto) {
      return `This action updates a #${id} cat`;
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return `This action removes a #${id} cat`;
    }

    //Use service
    constructor(private menuService: MenuService) {}

    @Post()
    async createCats(@Body() createCatDto: CreateMenuDto) {
        this.menuService.create(createCatDto);
    }

    @Get()
    async findAllCats(): Promise<Menu[]> {
        return this.menuService.findAll();
    }

    //Cách tiếp cận bằng thư viện express
    // import { Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
    // import { Response } from 'express';

    // @Controller('cats')
    // export class CatsController {
        // @Post()
        // create(@Res({ passthrough: true}) res: Response) {
        //     res.status(HttpStatus.CREATED).send();
        // }

        // @Get()
        // findAll(@Res() res: Response) {
        //     res.status(HttpStatus.OK).json([]);
        // }
    // }
}
