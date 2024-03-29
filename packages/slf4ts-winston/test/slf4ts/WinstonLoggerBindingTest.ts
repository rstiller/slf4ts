/* eslint-env mocha */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import 'source-map-support/register'

import * as chai from 'chai'
import { suite, test } from '@testdeck/mocha'
import { WinstonLoggerBinding } from '../../lib/slf4ts/WinstonLoggerBinding'

const expect = chai.expect

@suite
export class WinstonLoggerBindingTest {
  @test
  public async checkLoggerBinding (): Promise<void> {
    const binding = new WinstonLoggerBinding()

    expect(binding.getVendor()).to.equal('Winston')
    expect(binding.getVersion()).to.exist
    expect(binding.getLoggerImplementation()).to.exist
  }
}
