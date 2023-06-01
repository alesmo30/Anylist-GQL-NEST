import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { CurrentUser } from 'src/decoratos/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, {name: 'createItem'})
  createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() user: User
  ): Promise<Item> {
    return this.itemsService.create(createItemInput, user);
  }

  @Query(() => [Item], { name: 'items' })
  findAll(
    @CurrentUser() user: User
  ) {
    return this.itemsService.findAll(user);
  }

  @Query(() => Item, { name: 'findOne' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.itemsService.findOne(id);
  }

  @Mutation(() => Item)
  updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput): Promise<Item> {
    return this.itemsService.update(updateItemInput);
  }

  @Mutation(() => Item)
  removeItem(@Args('id', { type: () => ID }) id: string) {
    return this.itemsService.remove(id);
  }
}
