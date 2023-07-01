/* eslint-env mocha */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import 'source-map-support/register'

import * as chai from 'chai'
import { suite, test } from '@testdeck/mocha'
import { PinoLoggerBinding } from '../../lib/slf4ts/PinoLoggerBinding'

const expect = chai.expect

@suite
export class PinoLoggerBindingTest {
  @test
  public async checkLoggerBinding (): Promise<void> {
    const binding = new PinoLoggerBinding()

    expect(binding.getVendor()).to.equal('pino')
    expect(binding.getVersion()).to.exist
    expect(binding.getLoggerImplementation()).to.exist
  }
}
