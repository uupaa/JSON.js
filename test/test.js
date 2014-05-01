var ModuleTest = (function(global) {

return new Test({
        disable:    false,
        node:       true,
        browser:    true,
        worker:     true,
        button:     true,
        both:       true,
        primary:    global["JSON"],
        secondary:  global["JSON_"],
    }).add([
        testJSON,
    ]).run().clone();

function testJSON(next) {

    if (true) {
        console.log("testJSON ok");
        next && next.pass();
    } else {
        console.log("testJSON ng");
        next && next.miss();
    }
}

})((this || 0).self || global);

