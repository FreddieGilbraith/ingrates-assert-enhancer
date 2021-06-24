const customErrorName = "IngratesAssertionError";

class IngratesAssertionError extends Error {
	constructor(self, name, msg, ...info) {
		const message = `${customErrorName}: [${self} | ${name}] "${info.join(
			"\t",
		)}", ${JSON.stringify(msg)}`;

		super(message);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, IngratesAssertionError);
		}

		this.name = customErrorName;
		this.actorInfo = { self, name, msg };
		this.info = info;
	}
}

export default function assertEnhancer({ self, name, msg }) {
	function assert(condition, ...info) {
		if (!condition) {
			throw new IngratesAssertionError(self, name, msg, info);
		}
	}

	return {
		assert,
	};
}
