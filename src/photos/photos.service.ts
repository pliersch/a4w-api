import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Photo} from './entites/photo.entity';
import {UpdatePhotoDto} from "./dto/update-photo.dto";
import {DeletePhotoResultDto} from "./dto/delete-photo-result.dto";

@Injectable()
export class PhotosService {

  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
  ) {
  }

  async create(photo: Photo): Promise<Photo> {
    return await this.photoRepository.save(photo);
  }

  async findAll(): Promise<Photo[]> {
    return await this.photoRepository.find();
  }

  async findOne(id: string): Promise<Photo> {
    return await this.photoRepository.findOne(id);
  }

  async replace(photo: Photo) {
    return await this.photoRepository.update(photo.id, photo);
  }

  async update(id: string, dto: UpdatePhotoDto) {
    console.log(id, dto)
    return await this.photoRepository.update(id, dto);
  }

  async removeOne(id: string): Promise<DeletePhotoResultDto> {
    const photo = await this.photoRepository.findOne(id);
    const photo1 = await this.photoRepository.remove(photo);
    const res: string = photo1 ? id : null;
    console.log('PhotosService removeOne: ', res)
    return new Promise(function (resolve) {
      resolve({id: res});
    });

  }

  // async removeMany(photos: Photo[]) {
  //   return await this.photoRepository.remove(photos);
  // }
}
