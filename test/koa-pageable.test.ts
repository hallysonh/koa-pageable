import { Context } from 'koa';
import { Order, Direction } from '@hallysonh/pageable';
import paginate from '../src/koa-pageable';

describe('Tests', () => {
  describe('paginate function', () => {
    const next = () => ({});
    const context = {
      query: {
        page: 1,
        size: 20,
        sort: 'firstName',
        indexed: 'true',
      },
      state: {},
    } as Context;

    it('context.state matches snapshot when paginate is called with valid context', async () => {
      await paginate(context, next);
      expect(context.state).toMatchSnapshot();
    });

    it('context.state matches snapshot when paginate is called with string values for page and size', async () => {
      const updatedQuery = { ...context.query, page: '10', size: '15' };
      await paginate({ ...context, query: updatedQuery }, next);
      expect(context.state).toMatchSnapshot();
    });

    it('context.state matches snapshot when paginate is called with empty strings for page and size', async () => {
      const updatedQuery = { ...context.query, page: '', size: '' };
      await paginate({ ...context, query: updatedQuery }, next);
      expect(context.state).toMatchSnapshot();
    });

    it('context.state matches snapshot when paginate is called with undefined page, size, and sort', async () => {
      const updatedQuery = { indexed: 'true' };
      await paginate({ ...context, query: updatedQuery }, next);
      expect(context.state).toMatchSnapshot();
    });

    it('throws error when paginate is called with invalid values for page and size', async () => {
      const updatedQuery = { ...context.query, page: 'page', size: 'size' };
      try {
        await paginate({ ...context, query: updatedQuery }, next);
      } catch (e) {
        expect(e.message).toBe("Could not convert 'page' to number");
      }
    });
  });
});
