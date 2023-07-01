/* eslint-env mocha */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import 'source-map-support/register'

import * as chai from 'chai'
import { suite, test } from '@testdeck/mocha'
import { LoglevelLoggerBinding } from '../../lib/slf4ts/LoglevelLoggerBinding'

const expect = chai.expect

@suite
export class LoglevelLoggerBindingTest {
  @test
  public async checkLoggerBinding (): Promise<void> {
    const binding = new LoglevelLoggerBinding()

    expect(binding.getVendor()).to.equal('loglevel')
    expect(binding.getVersion()).to.exist
    expect(binding.getLoggerImplementation()).to.exist
  }
}
