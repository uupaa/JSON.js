var ModuleTestJSON = (function(global) {

return new Test("JSON", {
        disable:    false,
        browser:    true,
        worker:     true,
        node:       true,
        button:     true,
        both:       true,
    }).add([
        testJSON,
    ]).run().clone();

function testJSON(next) {

    if (true) {
        next && next.pass();
    } else {
        next && next.miss();
    }
}

})((this || 0).self || global);

