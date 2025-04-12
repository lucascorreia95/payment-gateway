import { Module } from '@nestjs/common';
import { FraudService } from './fraud/fraud.service';
import { FrequentHighValueSpecification } from './fraud/specification/frequent-high-value.specification';
import { SuspiciousAccountSpecification } from './fraud/specification/suspicius-acoount.specification';
import { UnusualAmountSpecification } from './fraud/specification/unusual-amount.specification';
import { FraudAggregateSpecification } from './fraud/specification/fraud-aggregate.specification';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { InvoicesConsumer } from './invoices.consumer';

@Module({
  providers: [
    FraudService,
    FrequentHighValueSpecification,
    SuspiciousAccountSpecification,
    UnusualAmountSpecification,
    FraudAggregateSpecification,
    {
      provide: 'FRAUD_SPECIFICATIONS',
      useFactory:(
        frequentHighValueSpecification: FrequentHighValueSpecification,
        suspiciousAccountSpecification: SuspiciousAccountSpecification,
        unusualAmountSpecification: UnusualAmountSpecification,
      ) => {
        return [
          frequentHighValueSpecification,
          suspiciousAccountSpecification,
          unusualAmountSpecification,
        ]
      },
      inject: [
        FrequentHighValueSpecification,
        SuspiciousAccountSpecification,
        UnusualAmountSpecification,
      ]
    },
    InvoicesService
  ],
  controllers: [InvoicesController, InvoicesConsumer]
})
export class InvoicesModule {}
