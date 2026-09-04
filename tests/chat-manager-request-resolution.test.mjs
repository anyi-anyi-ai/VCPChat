import test from 'node:test';
import assert from 'node:assert/strict';

test('request content resolution logic handles string, object, and empty input correctly', () => {
    function resolveContent(request, inputElement) {
        return typeof request === 'string'
            ? request
            : (typeof request?.content === 'string' ? request.content : inputElement.value);
    }

    const mockInput = { value: 'draft in input box' };

    // 1. String request (from AI interactive button [[点击按钮:xxx]])
    assert.equal(
        resolveContent('[[点击按钮:直接生成草稿]]', mockInput),
        '[[点击按钮:直接生成草稿]]',
        'Should directly resolve string request as content'
    );

    // 2. Object request with content property
    assert.equal(
        resolveContent({ content: 'message from object' }, mockInput),
        'message from object',
        'Should resolve request.content when passed an object'
    );

    // 3. Null or undefined request (fallback to inputElement.value)
    assert.equal(
        resolveContent(null, mockInput),
        'draft in input box',
        'Should fallback to input.value when request is null'
    );
    assert.equal(
        resolveContent(undefined, mockInput),
        'draft in input box',
        'Should fallback to input.value when request is undefined'
    );

    // 4. Object without content (fallback to inputElement.value)
    assert.equal(
        resolveContent({}, mockInput),
        'draft in input box',
        'Should fallback to input.value when request is empty object'
    );

    // 5. Empty input with no request
    assert.equal(
        resolveContent(null, { value: '' }),
        '',
        'Should return empty string when input is empty and request is null'
    );
});
