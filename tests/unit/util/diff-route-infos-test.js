import { paramsDiffer, pathsDiffer, qpsChanged, shouldRefreshModel } from 'ember-prefetch/-private/diff-route-info';
import { module, test } from 'qunit';
import { assign } from '@ember/polyfills';
import { gte } from 'ember-compatibility-helpers';

if (gte('3.6.0')) {
  module('paramsDiffer', () => {
    test('returns false if the params match', (assert) => {
      let info = {
        paramNames: ['post_id', 'comment_id'],
        params: { post_id: '1', comment_id: '1' }
      };
      assert.notOk(paramsDiffer([info], [info]))
    });

    test('returns true if the params mismatch', (assert) => {
      let info = {
        paramNames: ['post_id', 'comment_id'],
        params: { post_id: '1', comment_id: '1' }
      };
      let info2 = assign({}, info, { params: { post_id: '2' } });
      assert.ok(paramsDiffer([info], [info2]))
    });

    test('returns true if the paramNames mismatch', (assert) => {
      let info = {
        paramNames: ['post_id', 'comment_id'],
        params: { post_id: '1', comment_id: '1' }
      };
      let info2 = assign({}, info, { paramNames: ['picture_id', 'comment_id'] });
      assert.ok(paramsDiffer([info], [info2]))
    });

    test('returns true if paramNames are empty', (assert) => {
      let info = {
        paramNames: ['post_id', 'comment_id'],
        params: { post_id: '1', comment_id: '1' }
      };
      let info2 = assign({}, info, { paramNames: [] });
      assert.ok(paramsDiffer([info], [info2]))
    });

    test('returns true if params are empty', (assert) => {
      let info = {
        paramNames: ['post_id', 'comment_id'],
        params: { post_id: '1', comment_id: '1' }
      };
      let info2 = assign({}, info, { params: {} });
      assert.ok(paramsDiffer([info], [info2]))
    });

    test('smoke test (different)', (assert) => {
      let infos1 = [];
      let infos2 = [];

      for (let i = 0; i < 10; i++) {
        infos1.push({
          paramNames: [`${i}`],
          params: [{ [`${i}`]: 'foo' }]
        });

        infos2.push({
          paramNames: [`${i}*`],
          params: [{ [`${i}*`]: 'bar' }]
        });
      }

      assert.ok(paramsDiffer(infos1, infos2));
    });

    test('smoke test (same)', (assert) => {
      let infos1 = [];
      let infos2 = [];

      for (let i = 0; i < 10; i++) {
        let info = {
          paramNames: [`${i}`],
          params: [{ [`${i}`]: 'foo' }]
        };
        infos1.push(info);
        infos2.push(info);
      }

      assert.notOk(paramsDiffer(infos1, infos2));
    });
  });

  module('pathsDiffer', () => {
    test('returns false if the paths are the same', (assert) => {
      let info = {
        name: 'foo.bar'
      };
      assert.notOk(pathsDiffer([info], [info]))
    });

    test('returns true if the paths changed', (assert) => {
      let info = {
        name: 'foo.bar'
      };
      let info2 = assign({}, info, { name: 'baz.bar' });
      assert.ok(pathsDiffer([info], [info2]))
    });

    test('returns true if the paths changed', (assert) => {
      let info = {
        name: 'foo.bar'
      };
      let info2 = assign({}, info, { name: 'baz.bar' });
      assert.ok(pathsDiffer([info], [info2]))
    });

    test('returns true if the paths mismatch', (assert) => {
      let infos1 = [];
      let infos2 = [];

      for (let i = 0; i < 10; i++) {
        infos1.push({
          name: `${i}`
        });

        infos2.push({
          name: i % 2 ? `${i}` : `index`
        });
      }
      assert.ok(pathsDiffer(infos1, infos2))
    });
  });

  module('qpsChanged', () => {
    test('returns false if query params have not changed', (assert) => {
      let info = {
        queryParams: { a: 'b', c: 'd' }
      };
      assert.notOk(qpsChanged(info, info))
    });

    test('returns true if the query params have been removed', (assert) => {
      let info = {
        queryParams: { a: 'b', c: 'd' }
      };
      let info2 = {
        queryParams: { a: 'b' }
      };
      assert.ok(qpsChanged(info, info2))
    });

    test('returns true if the query params have changed', (assert) => {
      let info = {
        queryParams: { a: 'b', c: 'd' }
      };
      let info2 = {
        queryParams: { a: 'b', c: 'true' }
      };
      assert.ok(qpsChanged(info, info2))
    });

    test('returns true query params have been added', (assert) => {
      let info = {
        queryParams: { a: 'b', c: 'd' }
      };
      let info2 = {
        queryParams: { a: 'b', c: 'd', e: 'f' }
      };
      assert.ok(qpsChanged(info, info2))
    });

    test('returns true query params have been completely removed', (assert) => {
      let info = {
        queryParams: { a: 'b', c: 'd' }
      };
      let info2 = {
        queryParams: {}
      };
      assert.ok(qpsChanged(info, info2))
    });
  });

  module('shouldRefreshModel', () => {
    test('returns true if the `refreshModel` is set to true for a given QP', (assert) => {
      let routeQp = {
        foo: { refreshModel: true }
      };
      let queryParams = {
        foo: 'bar'
      }
      assert.ok(shouldRefreshModel(routeQp, queryParams))
    });

    test('returns false if refreshModel isnt set', (assert) => {
      let routeQp = {};
      let queryParams = {
        foo: 'bar'
      }
      assert.notOk(shouldRefreshModel(routeQp, queryParams))
    });

    test('returns false if refreshModel isnt set for a given qp', (assert) => {
      let routeQp = {
        bar: { refreshModel: true }
      };
      let queryParams = {
        foo: 'bar'
      }
      assert.notOk(shouldRefreshModel(routeQp, queryParams))
    });

    test('returns true if refreshModel is set for any qp', (assert) => {
      let routeQp = {
        bar: { refreshModel: true }
      };
      let queryParams = {
        foo: 'bar',
        biz: 'baz',
        bar: 'woot'
      }
      assert.ok(shouldRefreshModel(routeQp, queryParams))
    });
  });
}
