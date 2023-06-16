import { getAllFilesRecursively } from '../../lib/fileUtils'

describe('getAllFilesRecursively', () => {
  it('finds files', () => {
    const fileNames = getAllFilesRecursively('data')
    expect(fileNames.length).toBeGreaterThanOrEqual(1)
  })
})
