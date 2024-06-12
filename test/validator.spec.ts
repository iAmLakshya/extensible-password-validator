import { expect } from 'chai';
import { CreateValidator, DEFAULT_CONFIG, DEFAULT_PLUGIN_SET } from '../src';


describe('CreateValidator', () => {
	it('should create a validator with default configuration', () => {
		const validator = new CreateValidator();

		expect(validator.currentConfig).to.deep.equal(DEFAULT_CONFIG);
		expect(validator.plugins).to.deep.equal(DEFAULT_PLUGIN_SET);
	});

	it('should update configuration on initialization', () => {
		const customConfig = { checkAll: false };
		const validator = new CreateValidator({ config: customConfig });

		expect(validator.currentConfig.checkAll).to.equal(false);
	});

	it('should set plugins on initialization', () => {
		const mockPlugin1 = { prototype: { id: 'testPlugin1' } };
		const mockPlugin2 = { prototype: { id: 'testPlugin2' } };
		const validator = new CreateValidator({ config: { mergePlugins: false }, plugins: [mockPlugin1, mockPlugin2] as any });

		expect(validator.plugins.length).to.equal(2);
		expect(validator.plugins[0].prototype.id).to.equal('testPlugin1');
	});

	it('should add plugins using setPlugins', () => {
		const validator = new CreateValidator({ config: { mergePlugins: false } });
		const mockPlugin: any = { prototype: { id: 'testPlugin' } };

		validator.setPlugins([mockPlugin]);

		expect(validator.plugins.length).to.equal(1);
		expect(validator.plugins[0].prototype.id).to.equal('testPlugin');
	});

	it('should merge duplicate plugins with current config on setPlugins (mergeDuplicatePlugins)', () => {
		const validator = new CreateValidator({ config: { mergeDuplicatePlugins: true, mergePlugins: false } });
		const mockPlugin: any = { prototype: { id: 'testPlugin', operation: '<', check_value: 3 } };

		validator.setPlugins([mockPlugin, mockPlugin]); // Add duplicate plugin

		expect(validator.plugins.length).to.equal(1); // Merged into single plugin
		expect(validator.plugins[0].prototype.check_value).to.equal(3); // Retains original value
	});

	it('should override plugins on setPlugins (overridePlugins)', () => {
		const validator = new CreateValidator({ config: { overridePlugins: true, mergePlugins: false } });
		const mockPlugin1 = { prototype: { id: 'testPlugin', operation: '<', check_value: 3 } };
		const mockPlugin2 = { prototype: { id: 'testPlugin', operation: '<', check_value: 5 } };

		validator.setPlugins([mockPlugin1, mockPlugin2] as any);

		expect(validator.plugins.length).to.equal(1); // Override with the second plugin
		expect(validator.plugins[0].prototype.check_value).to.equal(5); // Uses new check value
	});

	it('should update configuration using updateConfig', () => {
		const validator = new CreateValidator();
		const customConfig = { checkAll: false };

		validator.updateConfig(customConfig);

		expect(validator.currentConfig.checkAll).to.equal(false);
	});

});
