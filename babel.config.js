
module.exports = {
    "presets": [
	"@babel/preset-react", "@babel/preset-env"
    ],
    "plugins": [
	"@babel/plugin-proposal-class-properties",
	"@babel/plugin-proposal-object-rest-spread",
    ],
    "env": {
	"test": {
            "plugins": [
		"@babel/plugin-proposal-class-properties",
		"@babel/plugin-proposal-object-rest-spread",
		"rewire"
            ]
	}
    }
};
