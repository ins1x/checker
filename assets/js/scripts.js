/*!
 * Script for Online-checker https://github.com/ins1x/checker
 */

 // Dropdown menu select
document.querySelectorAll('#dropdown-search .dropdown-item').forEach(item => {
  item.addEventListener('click', function(selDropdown) {
    selDropdown.preventDefault();
    const selectedText = this.innerText;
    document.getElementById('button-dropdown').innerText = selectedText;
  });
});

const inputElement = document.getElementById('input-Go');

// Go search <URL>
function GoSearch(query) {
  const searchQuery = inputElement.value.trim();
  const statusElement = document.getElementById("card-text-secondary");

  if (!searchQuery) {
    statusElement.innerHTML = `<small>You have not specified a value for the search. (IP, MAC or website name)</small>`;
    return;
  }

  const dropdownText = document.getElementById('button-dropdown').innerText.trim();
  
  const searchSources = {
    "MAC-Vendor": `https://maclookup.app/search/result?mac=${query}`,
    "Whois": `https://mxtoolbox.com/SuperTool.aspx?action=whois%3a${query}`,
    "Ping": `https://ping.pe/${query}`,
    "Trace": `https://tools.bunny.net/traceroute?query=${query}`,
    "DNS-Records": `https://dnschecker.org/all-dns-records-of-domain.php?query=${query}`,
    "MX-Record": `https://mxtoolbox.com/SuperTool.aspx?action=mx%3a${query}`,
    "Spam-base": `https://mxtoolbox.com/SuperTool.aspx?action=blacklist%3a${query}`,
    "Check-host": `https://check-host.net/check-http?host=${query}`,
    "Open-ports": `https://dnschecker.org/port-scanner.php?query=${query}&ptype=server`,
    "Vulnerable": `https://www.shodan.io/host/${query}`
  };

  const targetUrl = searchSources[dropdownText];

  if (targetUrl) {
    statusElement.innerHTML = `<small>Last search: ${searchQuery}</small>`;
    window.open(targetUrl, "_blank");
  } else {
    statusElement.innerHTML = `<small>Something went wrong, try reloading the page. <kbd>CTRL + R</kbd></small>`;
  }

}

// Search on press Go button
document.getElementById('button-Go').addEventListener('click', () => {
  const textValue = inputElement.value;
  GoSearch(textValue);
});

// Search on pressed 'Enter' key
inputElement.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
    const inputValue = event.target.value;
    GoSearch(inputValue); 
  }
});

// Input event
inputElement.addEventListener('input', (event) => {
  // Regular expression remove "http://" or "http" at the beginning of a line (case insensitive)
  event.target.value = event.target.value.replace(/^https?:\/\//i, '');
  // Regular expression remove "www." at the beginning of a line (case insensitive)
  event.target.value = event.target.value.replace(/^www\./i, '');
  
  const dropdownText = document.getElementById('button-dropdown').innerText.trim();
  
  // Select dropdown MAC-Vendor item if find MAC 
  const macRegex = /^(([0-9A-Fa-f]{2}[:]){5}|([0-9A-Fa-f]{2}[-]){5})([0-9A-Fa-f]{2})$/;
  if (macRegex.test(event.target.value)) {
    document.getElementById("button-dropdown").innerText = 'MAC-Vendor';
  }
  
  // Convert from cisco format dead.beef.1234 to common format de:ad:be:ef:12:34
  const ciscoMacRegex = /^([0-9a-fA-F]{4}\.){2}[0-9a-fA-F]{4}$/;
  if (ciscoMacRegex.test(event.target.value)) {
    const cleanMac = event.target.value.replace(/\./g, '');
    event.target.value = cleanMac.match(/.{1,2}/g).join(':').toLowerCase();
    document.getElementById("button-dropdown").innerText = 'MAC-Vendor';
  }
  
  // Convert from huawei format dead-beef-1234 to common format de:ad:be:ef:12:34
  const huaweiMacRegex = /^([0-9a-fA-F]{4}\-){2}[0-9a-fA-F]{4}$/;
  if (huaweiMacRegex.test(event.target.value)) {
    const cleanMac = event.target.value.replace(/\-/g, '');
    event.target.value = cleanMac.match(/.{1,2}/g).join(':').toLowerCase();
    document.getElementById("button-dropdown").innerText = 'MAC-Vendor';
  }

  // Select port check (Validates 0-255 ranges and 1-65535 ports)
  // const strictIpPortRegex = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d):(?:6553[0-5]|655[0-2]\d|65[0-4]\d\d|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3})$/;
});

// Maybe add later IP-API requests
// async function getIpApiData() {
//   try {
//     const response = await fetch('http://ip-api.com/json/?fields=query,country,regionName,timezone,isp,org,as,asname,reverse');
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
    
//     const data = await response.json(); 
//     const jsonToString = JSON.stringify(data, null, 2);
//     document.getElementById("ipapi").textContent = jsonToString;

//   } catch (error) {
//     console.error('Failed to fetch JSON:', error);
//   }
// }
// getIpApiData();