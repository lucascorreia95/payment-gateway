import { Injectable } from '@nestjs/common';
import { InvoiceStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private prismaService: PrismaService){}

  async findAll(filter?: { whithFraud?: boolean, accountId?: string }){
    const where = {
      ...(filter?.accountId && { accountId: filter.accountId }),
      ...(filter?.whithFraud && { status: InvoiceStatus.REJECTED }),
    }

    return this.prismaService.invoice.findMany({
      where,
      include: { account: true }
    })
  }

  async findOne(id: string) {
    return this.prismaService.invoice.findUnique({
      where: {
        id
      },
      include: {
        account: true
      }
    })
  }
}
