import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const QueryRunner = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const queryRunner = req.queryRunner;

    if (!queryRunner) {
      throw new InternalServerErrorException(
        'QueryRunner Decorator를 사용하려면 TransactionInterceptor를 적용해야 합니다.',
      );
    }

    return queryRunner;
  },
);
