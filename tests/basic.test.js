import test from "ava";
import { createActorSystem } from "@little-bonsai/ingrates";

import assertEnhancer from "../src/index.js";

test.beforeEach((t) => {
	t.context.system = createActorSystem({
		enhancers: [assertEnhancer],
	});
});

test("it throws no error when the invarient is valid", (t) =>
	new Promise((done) => {
		t.plan(1);

		function TestActor({ msg, assert }) {
			t.notThrows(() => assert(msg.x + msg.y === 3, "Maths Still Works"));
			done();
		}

		t.context.system.register(TestActor);
		t.context.system.dispatch(t.context.system.spawn.test(TestActor), {
			x: 1,
			y: 2,
		});
	}));

test("it throws an error when the invarient is invalid", (t) =>
	new Promise((done) => {
		t.plan(2);

		function TestActor({ msg, assert, self }) {
			const error = t.throws(
				() => assert(msg.x + msg.y === -1, "Maths Still Works"),
				{
					name: "IngratesAssertionError",
				},
			);

			t.like(error, {
				info: [["Maths Still Works"]],
				message: `IngratesAssertionError: [${self} | TestActor] "Maths Still Works", {"src":null,"x":1,"y":2}`,
				actorInfo: {
					self,
					name: "TestActor",
					msg: {
						src: null,
						x: 1,
						y: 2,
					},
				},
			});
			done();
		}

		t.context.system.register(TestActor);
		t.context.system.dispatch(t.context.system.spawn.test(TestActor), {
			x: 1,
			y: 2,
		});
	}));
