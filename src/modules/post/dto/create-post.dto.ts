// src/modules/post/dto/create-post.dto.ts

import { IsString, IsArray } from 'class-validator';

export class CreatePostDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsArray()
    @IsString({ each: true })
    tags: string[];
}
