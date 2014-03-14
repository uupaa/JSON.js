new Test().add([
        testJSON,
    ]).run().worker(function(err, test) {
        if (!err && typeof JSON_ !== "undefined") {
            var name = Test.swap(JSON, JSON_);

            new Test(test).run(function(err, test) {
                Test.undo(name);
            });
        }
    });

function testJSON(next) {

    if (true) {
        console.log("testJSON ok");
        next && next.pass();
    } else {
        console.log("testJSON ng");
        next && next.miss();
    }
}

