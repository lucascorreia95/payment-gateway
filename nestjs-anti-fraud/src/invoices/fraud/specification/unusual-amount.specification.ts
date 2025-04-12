import { FraudReason } from "@prisma/client";
import { FraudDetectionResult, FraudSpecificationContext, IFraudSpecification } from "./fraud-specification.interface";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UnusualAmountSpecification implements IFraudSpecification {
  constructor(private prismaService: PrismaService, private configService: ConfigService){}

  async detectFraud(context: FraudSpecificationContext): Promise<FraudDetectionResult> {
    const { account, amount } = context
    const suspiciousVariationPercentage = this.configService.getOrThrow<number>("SUSPICIOUS_VARIATION_PERCENTAGE")
    const invoicesHistoryCount = this.configService.getOrThrow<number>("INVOICES_HISTORY_COUNT")

    const previousInvoices = await this.prismaService.invoice.findMany({
      where:{
        accountId: account.id
      }, orderBy: {
        createdAt: 'desc'
      }, take: invoicesHistoryCount,
    })

    if (previousInvoices.length) {
      const totalAmount = previousInvoices.reduce((acc, invoice) => {
        return acc + invoice.amount;
      }, 0)

      const averageAmount = totalAmount / previousInvoices.length

      if(amount > averageAmount * (1 + suspiciousVariationPercentage / 100) + averageAmount) {
        return {
          hasFraud: true,
          reason: FraudReason.UNUSUAL_PATTERN,
          description: `Amount ${amount} is higher than the average amount ${averageAmount}`
        }
      }
    }

    return {
      hasFraud: false
    }
  }
}