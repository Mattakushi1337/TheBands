import { Controller, Param, Delete, UseGuards, Req, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt.guard';
import { MemberService } from './member.service';
import { BandService } from 'src/band/band.service';
import { Member } from './member.entity';
import { Band } from 'src/band/band.entity';

@Controller('member')
export class MemberController {
    constructor(private readonly memberService: MemberService, private readonly bandService: BandService) { }

    @UseGuards(JwtGuard)
    @Delete(':id')
    async delete(@Param('id') id: string, @Req() req: any): Promise<void> {
      const userId = req.cookies.userId;
      const memberId = parseInt(id);
  
      const member = await this.memberService.getMember(memberId);
      const bandId = member.band.id;
  
      await this.memberService.delete(memberId, bandId, userId);
    }
  }
