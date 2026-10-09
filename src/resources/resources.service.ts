import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from './entities/resource.entity.js';
import { CreateResourceDto } from './dto/create-resource.dto.js';
import { UpdateResourceDto } from './dto/update-resource.dto.js';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly repository: Repository<Resource>,
  ) {}

  public async create(dto: CreateResourceDto, userId: number) {
    const resource = this.repository.create({
      ...dto,
      userId,
    });
    return this.repository.save(resource);
  }

  public findAll() {
    return this.repository.find();
  }

  public async findById(id: number) {
    const resource = await this.repository.findOne({
      where: { id },
    });
    if (!resource) {
      throw new NotFoundException(`Resource #${id} not found`);
    }
    return resource;
  }

  public async update(dto: UpdateResourceDto, id: number, userId: number) {
    const resource = await this.findById(id);
    this.checkUser(resource, userId);
    Object.assign(resource, dto);
    return this.repository.save(resource);
  }

  public async remove(id: number, userId: number) {
    const resource = await this.findById(id);
    this.checkUser(resource,userId);
    await this.repository.remove(resource);
  }

  private checkUser(resource: Resource, userId: number) {
    if (resource.userId !== userId) {
      throw new ForbiddenException(`Resource #${resource.id} cant be changed`);
    }
  }
}
