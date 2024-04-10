module.exports = async (providers, params) => {
    return await providers[0].supply(params.id)
}