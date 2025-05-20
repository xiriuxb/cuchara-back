import { Controller, Get, Query } from '@nestjs/common';
import { FeedService } from './feed.service';
import { GetFeedQueryDto } from './dto/get-feed-query.dto';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  async getFeed(@Query() query: GetFeedQueryDto) {
    return this.feedService.getFeed(query.limit, query.cursor);
  }
}
