import { PrismaService } from "src/prisma/prisma.service";
import { FraudDetectionResult, FraudSpecificationContext, IFraudSpecification } from "./fraud-specification.interface";
import { ConfigService } from "@nestjs/config";
import { FraudReason } from "@prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FrequentHighValueSpecification implements IFraudSpecification {
  constructor(private prismaService: PrismaService, private configService: ConfigService){}

  async detectFraud(context: FraudSpecificationContext): Promise<FraudDetectionResult> {
    const { account } = context
    const SuspiciousInvoicesCount = this.configService.getOrThrow<number>("SUSPICIOUS_INVOICES_COUNT")
    const SuspiciousTimeframeHours = this.configService.getOrThrow<number>("SUSPICIOUS_TIMEFRAME_HOURS")

    const recentDate = new Date()
    recentDate.setHours(recentDate.getHours() - SuspiciousTimeframeHours)

    const recentInvoices = await this.prismaService.invoice.findMany({
      where: {
        accountId: account.id,
        createdAt: {
          gte: recentDate
        }
      }
    })

    if (recentInvoices.length > SuspiciousInvoicesCount) {
      await this.prismaService.account.update({
        where: { id: account.id },
        data: { isSuspicious: true }
      })

      return {
        hasFraud: true,
        reason: FraudReason.FREQUENT_HIGH_VALUE,
        description: `${recentInvoices.length} high-value invoices in the last ${SuspiciousTimeframeHours} hours`
      }
    }

    return {
      hasFraud: false
    }
  }
}