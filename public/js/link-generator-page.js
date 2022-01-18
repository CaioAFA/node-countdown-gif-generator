const getFontsList = async () => {
  const fonts = await new Promise((resolve, reject) => {
    $.getJSON('/fonts', function (data) {
      resolve(data)
    }).fail(() => {
      resolve([])
    })
  })

  return fonts
}

const fonts = getFontsList()
  .then(fonts => {
    const selectFontInput = document.getElementById('font-family')
    selectFontInput.innerHTML = selectFontInput.innerHTML + fonts.map(f => `
          <option value=${f}>${f}</option>
      `)
  })

// Load Color Pickers
$("#background-color-picker").spectrum({
  preferredFormat: "hex",
  color: "#000",
  showAlpha: false
});
$("#font-color-picker").spectrum({
  preferredFormat: "hex",
  color: "#FF0",
  showAlpha: false
});

// Load today date to "date" input
const date = new Date()
const offset = date.getTimezoneOffset()
const tomorrow = new Date(date.getTime() - (offset * 60 * 1000))
tomorrow.setDate(tomorrow.getDate() + 1)

const dateInput = document.getElementById('date')
dateInput.value = tomorrow.toISOString().split('T')[0]

// initialize time picker
$('#hour').timepicker({
  'showDuration': true,
  'timeFormat': 'h:i A',
});
$('#hour').val('09:00 AM')

// Handle submit
$('#main-form').submit((e) => {
  e.preventDefault()

  const rawData = $('#main-form').serializeArray()

  // Convert from array to JSON
  const data = {}
  rawData.forEach((d) => {
    data[d['name']] = d['value']
  })

  data['time'] = data['date']
  data['time'] += 'T' + data['hour']
    .replace(' AM', '')
    .replace(' PM', '')

  delete data['date']
  delete data['hour']

  data['bg'] = data['bg'].replaceAll('#', '')
  data['color'] = data['color'].replaceAll('#', '')

  data['name'] = 'generatedGif'

  let url = `${window.location.origin}/serve?`
  Object.keys(data).forEach((d) => {
    url += `${d}=${data[d]}&`
  })

  $('#generated-link').attr('href', url)
  $('#generated-image').attr('src', url)
  $('#preview').show()

  $('#open-link-button').click(() => window.open(url))

  if(navigator.clipboard){
    $('#copy-link-button').show()

    $('#copy-link-button').click(() => {
      navigator.clipboard.writeText(url)
    })
  }
  else {
    $('#copy-link-button').hide()
  }
})

const newFont = () => {
  const formData = new FormData()
  const files = $('#new-font-file')[0].files

  if (files.length == 0) return

  const newFont = files[0]
  formData.set('new-font', newFont)

  $.ajax({
    url: '/fonts',
    type: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    success: function (response) {
      alert('Fonte cadastrada com sucesso!')
      window.location.reload()
    },
    fail: function (response) {
      alert('Erro ao cadastrar fonte!')
    }
  });
}

const openDeleteFontModal = () => {
  $('#deleteFontModal').modal()
  const selectedFont = $('#font-family').val()
  document.getElementById('deleteFontModalLabel').innerHTML = `Deletar Fonte ${selectedFont}?`
}

const deleteFont = () => {
  const selectedFont = $('#font-family').val()

  $.ajax({
    url: `/fonts/${selectedFont}`,
    type: 'DELETE',
    success: function (response) {
      alert('Fonte deletada!')
      window.location.reload()
    },
    error: function (response) {
      alert(response.responseText)
    }
  });
}
